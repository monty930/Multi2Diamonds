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
        return Json(model);
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