using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Multi2Diamonds.Managers;
using Multi2Diamonds.Models.DbModels;
using Multi2Diamonds.Repositories;
using Multi2Diamonds.Scenarios;
using Multi2Diamonds.Scenarios.Models;

namespace Multi2Diamonds.Controllers;

// [Authorize]
public partial class ScenariosController : Controller
{
    private readonly ScenariosManager _scenariosManager = new();
    private readonly UserRepository _userRepository = new();
    private readonly DealSetRepository _dealSetRepository = new();

    [EnableCors]
    [HttpPost]
    [Route("Scenarios/GenerateDeals")]
    public async Task<IActionResult> GenerateDeals([FromBody] SettingsArgs compilerSettings)
    {
        Console.WriteLine("GenerateDeals here!!!");
        var model = await _scenariosManager.GenerateDeals(new ScenariosModel
            { CompilerRunner = new CompilerRunner(compilerSettings) });
        return Json(new { scriptRawOutput = model.ScriptOutputRaw, correctDeal = model.IsCorrectDeal });
    }

    // [EnableCors]
    // [HttpGet]
    // public async Task<IActionResult> SavedItem(string savedContentId)
    // {
    //     var user = _userRepository.GetByName(User.Identity.Name);
    //     if (user == null) return Json(new { success = false, message = "User not found" });

    //     var status = "";
    //     var content = "";
    //     var name = "";
    //     var partial = "";
    //     var savedContent = _userRepository.GetSavedContentById(int.Parse(savedContentId));

    //     if (savedContent == null)
    //     {
    //         status = "error";
    //         // generate partial view of error
    //         partial = await RenderViewAsync("RightSideView", new IndexViewModel
    //         {
    //             ScriptOutputRaw = "Saved content not found",
    //             RightDisplay = RightViewDisplay.Error
    //         }, true);
    //     }
    //     else
    //     {
    //         content = savedContent.Content;
    //         name = savedContent.Name;
    //         var type = savedContent.SavedContentType;
    //         if (type == SavedContentType.DealSet)
    //         {
    //             status = "dealset";
    //             var model = new IndexViewModel
    //             {
    //                 RightDisplay = RightViewDisplay.DealSetEntry,
    //                 ScriptOutputRaw = content
    //             };
    //             partial = await RenderViewAsync("RightSideView", model, true);
    //         }
    //         else
    //         {
    //             status = "constraint";
    //         }
    //     }
        
    //     return Json(new { status, name, content, partial });
    // }

    [EnableCors]
    [HttpPost]
    [Route("Scenarios/AddItem")]
    public async Task<JsonResult> AddItem([FromBody] Scenario scenario)
    {
        // var user = _userRepository.GetByName(User.Identity.Name);
        // if (user == null) return Json(new { success = false, message = "User not found" });
        
        // input.UserId = user.UserId;
        // input.User = user;
        
        // var id = input.SavedContentId;

        // if (!input.Exists)
        // {
        //     id = _userRepository.AddSavedContent(input);
        // }
        // else
        // {
        //     _userRepository.UpdateSavedContent(input);
        // }
        Console.WriteLine("AddItem here!!!- " + scenario.Name + " - " + scenario.ScenarioContent);
        var id = 1; // to be deleted

        return Json(new { success = true, message = "Item added successfully", id });
    }
    
    [HttpGet]
    [Route("Scenarios/GetDealSetDetails")]
    public async Task<IActionResult> GetDealSetDetails([FromQuery] string dealSetId)
    {
        var id = int.Parse(dealSetId);
        var dealSetRaw = _dealSetRepository.GetDealSetRaw(id);
        var dealSet = _dealSetRepository.GetDealSetDetails(id);
        if (dealSetRaw == null) return NotFound();
        return Ok(new { dealSet = dealSet, dealSetRaw = dealSetRaw });
    }
}