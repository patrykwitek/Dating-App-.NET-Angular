using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public MessageRepository(
            DataContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            _context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupForConnection(string connectionId)
        {
            return await _context.Groups
                .Include(group => group.Connections)
                .Where(group => group.Connections.Any(connection => connection.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FindAsync(id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await _context.Groups
                .Include(group => group.Connections)
                .FirstOrDefaultAsync(group => group.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams)
        {
            var query = _context.Messages
                .OrderByDescending(message => message.MessageSent)
                .AsQueryable();

            query = messageParams.Container switch
            {
                "Inbox" => query.Where(user => user.RecipientUsername == messageParams.Username && user.RecipientDeleted == false),
                "Outbox" => query.Where(user => user.SenderUsername == messageParams.Username && user.SenderDeleted == false),
                _ => query.Where(user => user.RecipientUsername == messageParams.Username && user.RecipientDeleted == false && user.DateRead == null) // note: defaultowo oznacza nieprzeczytane
            };

            var messages = query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider);

            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            // note: ta metoda zwraca wiadomości między dwoma użytkownikami
            var query = _context.Messages
                // note: nieoptymalna wersja z dłuższym zapytaniem
                // .Include(user => user.Sender).ThenInclude(photo => photo.Photos)
                // .Include(user => user.Recipient).ThenInclude(photo => photo.Photos)
                .Where(
                    message =>
                        message.RecipientUsername == currentUsername && message.RecipientDeleted == false &&
                        message.SenderUsername == recipientUsername ||
                        message.RecipientUsername == recipientUsername && message.SenderDeleted == false &&
                        message.SenderUsername == currentUsername
                )
                .OrderBy(message => message.MessageSent)
                .AsQueryable();

            var unreadMessages = query.Where(message => message.DateRead == null && message.RecipientUsername == currentUsername).ToList();

            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }

            // note: nieoptymalna starsza wersja
            // return _mapper.Map<IEnumerable<MessageDto>>(messages);

            return await query.ProjectTo<MessageDto>(_mapper.ConfigurationProvider).ToListAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }
    }
}