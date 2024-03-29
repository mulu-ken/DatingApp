﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using System.Linq;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class MessageRepository: IMessageRepository
{
   private readonly DataContext _context;
   private readonly IMapper _mapper;

   public MessageRepository(DataContext context, IMapper mapper)
   {
      _context = context;
      _mapper = mapper;
   }

   public void AddMessage(Message message)
   {
      _context.Messages.Add(message);
   }

   public void DeleteMessage(Message message)
   {
      _context.Messages.Remove(message);
   }

   public async Task<Message> GetMessage(int id)
   {
      return await _context.Messages.FindAsync(id);
   }

   

   public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
   {
      var query = _context.Messages
         .OrderByDescending(x => x.MessageSent)
         .AsQueryable();

      query = messageParams.Container switch
      {
         "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username
          && u.RecipientDeleted == false),
         "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username
         && u.SenderDeleted == false),
         _ => query.Where(u => u.RecipientUsername == messageParams.Username 
                               && u.RecipientDeleted == false
                               && u.DateRead == null)
      };
      var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);
      return await PagedList<MessageDto>
         .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
   }

   public async Task<IEnumerable<MessageDto>> GetMessagesThread(string currentUserName, string recipientUserName)
   {
      var query =  _context.Messages
         .Where(m => m.Recipient.UserName == currentUserName
                     && m.RecipientDeleted == false
                     && m.Sender.UserName == recipientUserName || 
                     m.Recipient.UserName == recipientUserName && m.SenderDeleted == false && m.Sender.UserName == currentUserName)
         .OrderBy(m => m.MessageSent)
         .AsQueryable();
        
      
      var unreadMessages = query.Where(m => m.DateRead == null 
                                               && m.Recipient.UserName == currentUserName).ToList();

      if (unreadMessages.Any())
      {
         foreach (var unreadMessage in unreadMessages)
         {
            unreadMessage.DateRead = DateTime.UtcNow;
         }
      }

      return await query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToListAsync();
   }

   public void AddGroup(Group group)
   {
      _context.Groups.Add(group);
   }

   public void RemoveConnection(Connection connection)
   {
      _context.Connections.Remove(connection);
   }

   public async Task<Connection> GetConnection(string connectionId)
   {
      return await _context.Connections.FindAsync(connectionId);
   }

   public async Task<Group> GetMessageGroup(string groupName)
   {
      return await _context.Groups
         .Include(x => x.Connections)
         .FirstOrDefaultAsync(x => x.Name == groupName); //
   }
}