using BridgeScenarios.Managers;
using BridgeScenarios.Models.ViewModels;
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
    public async Task<IActionResult> Save([FromForm] string textInput)
    {
        var model = await _indexManager.Save(new IndexViewModel
        {
            TextInput = textInput
        });
        return File(model.OutputStream, "application/octet-stream", "scenario.txt");
    }
}