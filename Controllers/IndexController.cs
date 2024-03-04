using BridgeScenarios.Managers;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        var model = await _indexManager.GenerateDealSet(new IndexViewModel
        {
            TextInput = textInput
        });
        
        var pbnString = model.ScriptOutput;
        var htmlContent = await this.RenderViewAsync("RightSideView", model, true);
        return Json(new { htmlContent = htmlContent, pbnString = pbnString });
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> GenerateExample([FromForm] string textInput)
    {
        var model = await _indexManager.GenerateExample(new IndexViewModel
        {
            TextInput = textInput
        });
        
        var pbnString = model.ScriptOutput;
        var htmlContent = await this.RenderViewAsync("RightSideView", model, true);
        return Json(new { htmlContent = htmlContent, pbnString = pbnString });
    }

// This method is to render a view to string
    public async Task<string> RenderViewAsync<TModel>(string viewName, TModel model, bool partial = false)
    {
        if (string.IsNullOrEmpty(viewName))
        {
            viewName = this.ControllerContext.ActionDescriptor.ActionName;
        }

        this.ViewData.Model = model;

        using (var writer = new StringWriter())
        {
            IViewEngine viewEngine = HttpContext.RequestServices.GetService(typeof(ICompositeViewEngine)) as ICompositeViewEngine;
            ViewEngineResult viewResult = viewEngine.FindView(this.ControllerContext, viewName, !partial);

            if (viewResult.Success == false)
            {
                return $"A view with the name {viewName} could not be found";
            }

            ViewContext viewContext = new ViewContext(
                this.ControllerContext,
                viewResult.View,
                this.ViewData,
                this.TempData,
                writer,
                new HtmlHelperOptions()
            );

            await viewResult.View.RenderAsync(viewContext);
            return writer.GetStringBuilder().ToString();
        }
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
    public async Task<IActionResult> RegenerateOne([FromForm] string textInput, [FromForm] string dealSetData, [FromForm] int whichDeal)
    {
        var model = await _indexManager.RegenerateOne(new IndexViewModel
        {
            ScriptOutputInfo = new ScriptOutputInfo(dealSetData, 0, whichDeal),
            TextInput = textInput
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