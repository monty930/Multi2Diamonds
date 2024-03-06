using BridgeScenarios.Managers;
using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using BridgeScenarios.Redeal;
using BridgeScenarios.Redeal.Models;

namespace BridgeScenarios.Controllers;

[Authorize]
public class IndexController : Controller
{
    private readonly IndexManager _indexManager = new();

    [HttpGet]
    [EnableCors]
    public async Task<IActionResult> Index()
    {
        return View("Index", new IndexViewModel());
    }

    [HttpPost]
    [Route("Index/GenerateDealSet")]
    public async Task<IActionResult> GenerateDealSet([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            RedealRunner = new RedealRunner(compilerSettings)
        });

        var pbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, pbnString, correctDeal });
    }

    [EnableCors]
    [HttpPost]
    [Route("Index/GenerateExample")]
    public async Task<IActionResult> GenerateExample([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.Example,
            RedealRunner = new RedealRunner(compilerSettings)
        });

        var pbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, pbnString, correctDeal });
    }

    [EnableCors]
    [HttpPost]
    [Route("Index/AddDeal")]
    public async Task<IActionResult> AddDeal([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            RedealRunner = new RedealRunner(compilerSettings)
        });

        var newDealPbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, newDealPbnString, correctDeal });
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> RegenerateOne([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            RedealRunner = new RedealRunner(compilerSettings)
        });

        var newDealPbnString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, newDealPbnString, correctDeal });
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

        await using var writer = new StringWriter();
        
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