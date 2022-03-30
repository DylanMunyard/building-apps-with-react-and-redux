using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;

namespace theapi.Controllers;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    
    private readonly ILogger<WeatherForecastController> _logger;
    private readonly ForecastsCache _forecastsCache;

    public WeatherForecastController(ILogger<WeatherForecastController> logger, ForecastsCache forecastsCache)
    {
        _logger = logger;
        _forecastsCache = forecastsCache;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public IEnumerable<WeatherForecast> Get()
    {
        return _forecastsCache.Get();
    }

    [HttpGet("{id:int}")]
    public WeatherForecast GetForecast([FromRoute] int id)
    {
        return _forecastsCache.Get().First(f => f.Id == id);
    }

    [HttpPost]
    public WeatherForecast SaveForecast([FromBody] WeatherForecast forecast)
    {
        forecast.Id = _forecastsCache.Get().Count + 1; 
        return _forecastsCache.Add(forecast);
    }

    [HttpPut("{id:int}")]
    public IActionResult UpdateForecast([FromRoute] int id, [FromBody] WeatherForecast forecast)
    {
        var forecasts = _forecastsCache.Get();
        var updateForecast = forecasts.FirstOrDefault(a => a.Id == id);
        if (updateForecast == null)
        {
            return NotFound();
        }
        var idx = forecasts.IndexOf(updateForecast);
        forecasts[idx] = forecast;
        _forecastsCache.Set(forecasts);
        return new JsonResult(forecast);
    }

    [HttpDelete("{id:int}")]
    public IActionResult DeleteForecast([FromRoute] int id)
    {
        var forecasts = _forecastsCache.Get();
        var deleteForecast = forecasts.FirstOrDefault(a => a.Id == id);
        if (deleteForecast == null)
        {
            return NotFound();
        }
        var idx = forecasts.IndexOf(deleteForecast);
        forecasts.RemoveAt(idx);
        _forecastsCache.Set(forecasts);
        return new JsonResult(deleteForecast);
    }
}
