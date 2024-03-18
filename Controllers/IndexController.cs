using BridgeScenarios.DealSetTools;
using BridgeScenarios.DealSetTools.Models;
using BridgeScenarios.Managers;
using BridgeScenarios.Models;
using BridgeScenarios.Models.ViewModels;
using BridgeScenarios.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace BridgeScenarios.Controllers;

[Authorize]
public class IndexController : Controller
{
    private readonly IndexManager _indexManager = new();
    private readonly UserRepository _userRepository = new();

    [HttpGet]
    [EnableCors]
    public Task<IActionResult> Index()
    {
        return Task.FromResult<IActionResult>(View("Index", new IndexViewModel()));
    }

    [HttpPost]
    [Route("Index/GenerateDealSet")]
    public async Task<IActionResult> GenerateDealSet([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSetEntry,
            CompilerRunner = new CompilerRunner(compilerSettings)
        });

        var dsiString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, dsiString, correctDeal });
    }

    [EnableCors]
    [HttpPost]
    [Route("Index/GenerateExample")]
    public async Task<IActionResult> GenerateExample([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.Example,
            CompilerRunner = new CompilerRunner(compilerSettings)
        });

        var dsiString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, dsiString, correctDeal });
    }

    [EnableCors]
    [HttpPost]
    [Route("Index/AddDeal")]
    public async Task<IActionResult> AddDeal([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            CompilerRunner = new CompilerRunner(compilerSettings)
        });

        var newDealDsiString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, newDealDsiString, correctDeal });
    }
    
    [EnableCors]
    [HttpPost]
    public async Task<IActionResult> RegenerateOne([FromBody] SettingsArgs compilerSettings)
    {
        var model = await _indexManager.GenerateDeals(new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet,
            CompilerRunner = new CompilerRunner(compilerSettings)
        });

        var newDealDsiString = model.ScriptOutputRaw;
        var htmlContent = await RenderViewAsync("RightSideView", model, true);
        var correctDeal = (model.RightDisplay != RightViewDisplay.Error).ToString();
        return Json(new { htmlContent, newDealDsiString, correctDeal });
    }

    [EnableCors]
    [HttpGet]
    public Task<IActionResult> DefaultPage()
    {
        var model = new IndexViewModel
        {
            RightDisplay = RightViewDisplay.Entry
        };
        return Task.FromResult<IActionResult>(PartialView("RightSideView", model));
    }
    
    [EnableCors]
    [HttpGet]
    public async Task<IActionResult> SavedConstraint(string savedContentId)
    {
        var user = _userRepository.GetByName(User.Identity.Name);
        if (user == null)
        {
            return Json(new { success = false, message = "User not found" });
        }
        
        var savedContent = _userRepository.GetSavedContentById(int.Parse(savedContentId));
        var content = savedContent?.Content ?? "Constraints not found";

        return Json(new { content });
    }
    
    [EnableCors]
    [HttpGet]
    public Task<IActionResult> DealSetGetView()
    {
        var model = new IndexViewModel
        {
            RightDisplay = RightViewDisplay.DealSet
        };
        return Task.FromResult<IActionResult>(PartialView("RightSideView", model));
    }

    private async Task<string> RenderViewAsync<TModel>
        (string viewName, TModel model, bool partial = false)
    {
        if (string.IsNullOrEmpty(viewName)) viewName =
            ControllerContext.ActionDescriptor.ActionName;

        ViewData.Model = model;

        await using var writer = new StringWriter();
        
        IViewEngine viewEngine =
            HttpContext.RequestServices.GetService(typeof(ICompositeViewEngine))
                as ICompositeViewEngine ?? throw new InvalidOperationException();
        var viewResult = viewEngine.FindView(ControllerContext, viewName, !partial);

        if (viewResult.Success == false) return 
            $"A view with the name {viewName} could not be found";

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