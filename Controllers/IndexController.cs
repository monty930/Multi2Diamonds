using BridgeScenarios.Managers;
using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using BridgeScenarios.Redeal;

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
    public async Task<IActionResult> GenerateDealSet([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            TextInput = textInput,
            Compiler = new ChaiCompilerSettings(10),
            RightDisplay = RightViewDisplay.DealSet
        });

        var pbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        return Json(new { htmlContent, pbnString });
    }

    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> GenerateExample([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            TextInput = textInput,
            Compiler = new ChaiCompilerSettings(1),
            RightDisplay = RightViewDisplay.Example
        });

        var pbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        return Json(new { htmlContent, pbnString });
    }

    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> AddDeal([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            TextInput = textInput,
            Compiler = new ChaiCompilerSettings(1),
            RightDisplay = RightViewDisplay.DealSet
        });

        var newDealPbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        return Json(new { htmlContent, newDealPbnString });
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> RegenerateOne([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            TextInput = textInput,
            Compiler = new ChaiCompilerSettings(1),
            RightDisplay = RightViewDisplay.DealSet
        });

        var newDealPbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        return Json(new { htmlContent, newDealPbnString });
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> DefaultPage([FromForm] string textInput)
    {
        var model = new IndexViewModel();
        model.RightDisplay = RightViewDisplay.Entry;
        return PartialView("RightSideView", model);
    }
    
    public async Task<string> RenderViewAsync<TModel>(string viewName, TModel model, bool partial = false)
    {
        if (string.IsNullOrEmpty(viewName)) viewName = ControllerContext.ActionDescriptor.ActionName;

        ViewData.Model = model;

        using (var writer = new StringWriter())
        {
            IViewEngine viewEngine =
                HttpContext.RequestServices.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;
            var viewResult = viewEngine.FindView(ControllerContext, viewName, !partial);

            if (viewResult.Success == false) return $"A view with the name {viewName} could not be found";

            var viewContext = new ViewContext(
                ControllerContext,
                viewResult.View,
                ViewData,
                TempData,
                writer,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return writer.GetStringBuilder().ToString();
        }
    }
}