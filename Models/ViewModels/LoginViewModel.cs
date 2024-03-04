using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Models.ViewModels;

public class LoginViewModel
{
    public User User { get; set; }
    public string LoginError = string.Empty;
    public string SignupError = string.Empty;
}