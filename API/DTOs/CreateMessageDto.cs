namespace API.DTOs
{
    // note: jest to klasa przechwytująca wiadomość od klienta
    // tworzymy nową klasę, a nie używamy MessageDto, ponieważ potrzebujemy tylko dwie właściwości
    public class CreateMessageDto
    {
        public string RecipientUsername { get; set; }
        public string Content { get; set; }
    }
}