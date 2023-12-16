using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        return user.Claims.First(x => x.Type == ClaimTypes.Name).Value;
        
    }
    
    public static string GetUserId(this ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}