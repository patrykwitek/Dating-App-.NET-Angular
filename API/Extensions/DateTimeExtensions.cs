namespace API.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateTime birthday)
        {
            DateTime currentDate = DateTime.Today;
            int age = currentDate.Year - birthday.Year;

            if (birthday.Date > currentDate.AddYears(-age))
            {
                age--;
            }

            return age;
        }
    }
}