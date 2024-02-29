using BridgeScenarios.Managers;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Redeal;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.RazorPages;

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
    public async Task<IActionResult> Play([FromForm] string textInput)
    {
        var model = await _indexManager.Play(new IndexViewModel
        {
            TextInput = textInput
        });
        return View("Index", model);
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> Save([FromForm] string textInput)
    {
        var model = await _indexManager.Save(new IndexViewModel {});
        return File(model.OutputStream, "application/octet-stream", "scenario.txt");
    }
    
}