using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BridgeScenarios.Models.DbModels;

public class UsersSavedContent
{
    [Key]
    public int SavedContentId { get; set; }
    
    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    
    [StringLength(40)]
    public string Name { get; set; } = string.Empty;
    
    public DateTime CreationDate { get; set; } = DateTime.UtcNow;
    
    public string Content { get; set; } = string.Empty;
    
    public SavedContentType? SavedContentType { get; set; }
}

