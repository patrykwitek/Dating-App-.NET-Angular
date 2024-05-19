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

            var unitOfWork = resultContext.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();

            // note: używanie tutaj metody GetUserByIdAsync zamiast GetUserByUsernameAsync skróca zapytanie wysyłane do bazy, ponieważ GetUserByUsernameAsync uwzględnia też zdjęcia
            var user = await unitOfWork.UserRepository.GetUserByIdAsync(userId);
            user.LastActive = DateTime.UtcNow;

            await unitOfWork.Complete();
        }
    }
}