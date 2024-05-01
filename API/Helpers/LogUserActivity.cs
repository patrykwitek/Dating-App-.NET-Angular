using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        // note: ta metoda wykonuje się pod koniec wykonania każdego endpointu i aktualizuje użytkownikowi pole lastActive
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated)
            {
                return;
            }

            var userId = resultContext.HttpContext.User.GetUserId();

            var repository = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

            // note: używanie tutaj metody GetUserByIdAsync zamiast GetUserByUsernameAsync skróca zapytanie wysyłane do bazy, ponieważ GetUserByUsernameAsync uwzględnia też zdjęcia
            var user = await repository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;

            await repository.SaveAllAsync();
        }
    }
}