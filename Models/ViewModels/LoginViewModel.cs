using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Models.ViewModels;

public class LoginViewModel
{
    public string LoginError = string.Empty;
    public string SignupError = string.Empty;
    public User User { get; set; }
}