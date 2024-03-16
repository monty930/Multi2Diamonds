using BridgeScenarios.Models.DbModels;

namespace BridgeScenarios.Models.ViewModels;

public class SavedContentViewModel
{
    public List<UsersSavedContent> SavedContents { get; set; } = new();
}