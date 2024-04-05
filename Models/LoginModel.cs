using Multi2Diamonds.Models.DbModels;

namespace Multi2Diamonds.Models;

public class LoginModel
{
    public string LoginError = string.Empty;
    public string SignupError = string.Empty;
    public User User { get; set; }
}