using BridgeScenarios.Managers;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace BridgeScenarios.Controllers;

public class IndexController : Controller
{
    private readonly IndexManager _indexManager = new();

    [HttpGet]
    [EnableCors]
    public async Task<IActionResult> Index()
    {
        return View("Index", new IndexViewModel());
    }

    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> GenerateExample([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateExample(new IndexViewModel
        {
            TextInput = textInput
        });
        return PartialView("RightSideView", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> GenerateDealSet([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateDealSet(new IndexViewModel
        {
            TextInput = textInput
        });
        return PartialView("RightSideView", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> NextDeal([FromForm] string _, [FromForm] string dealSetData, [FromForm] int whichDeal)
    {
        var model = await _indexManager.MoveDeal(new IndexViewModel
        {
            ScriptOutputInfo = new ScriptOutputInfo(dealSetData, 0, whichDeal)
        }, 1);
        return PartialView("RightSideView", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> PreviousDeal([FromForm] string _, [FromForm] string dealSetData, [FromForm] int whichDeal)
    {
        var model = await _indexManager.MoveDeal(new IndexViewModel
        {
            ScriptOutputInfo = new ScriptOutputInfo(dealSetData, 0, whichDeal)
        }, -1);
        return PartialView("RightSideView", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> Trash([FromForm] string _, [FromForm] string dealSetData, [FromForm] int whichDeal)
    {
        var model = await _indexManager.Trash(new IndexViewModel
        {
            ScriptOutputInfo = new ScriptOutputInfo(dealSetData, 0, whichDeal)
        });
        return PartialView("RightSideView", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> RegenerateOne([FromForm] string _, [FromForm] string dealSetData, [FromForm] int whichDeal)
    {
        var model = await _indexManager.RegenerateOne(new IndexViewModel
        {
            ScriptOutputInfo = new ScriptOutputInfo(dealSetData, 0, whichDeal)
        });
        return PartialView("RightSideView", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> AddDeal([FromForm] string _, [FromForm] string dealSetData, [FromForm] int whichDeal)
    {
        var model = await _indexManager.AddDeal(new IndexViewModel
        {
            ScriptOutputInfo = new ScriptOutputInfo(dealSetData, 0, whichDeal)
        });
        return PartialView("RightSideView", model);
    }
}