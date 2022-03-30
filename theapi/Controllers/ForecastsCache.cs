using Microsoft.Extensions.Caching.Memory;

namespace theapi.Controllers;

public class ForecastsCache
{
    private readonly IMemoryCache _memoryCache;
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    public ForecastsCache(IMemoryCache memoryCache)
    {
        _memoryCache = memoryCache;

        var forecasts = Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Id = index,
                Date = DateTime.Now.AddDays(index).ToUniversalTime().ToString("yyyy-MM-dd"),
                Temperature = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToList();
        _memoryCache.Set("forecasts", forecasts, TimeSpan.FromDays(1));
    }

    public WeatherForecast Add(WeatherForecast forecast)
    {
        var forecasts = _memoryCache.Get<List<WeatherForecast>>("forecasts");
        forecasts.Add(forecast);
        _memoryCache.Set("forecasts", forecasts, TimeSpan.FromDays(1));
        return forecast;
    }

    public List<WeatherForecast> Get()
    {
        return _memoryCache.Get<List<WeatherForecast>>("forecasts");
    }

    public void Set(List<WeatherForecast> forecasts)
    {
        _memoryCache.Set("forecasts", forecasts, TimeSpan.FromDays(1));
    }
}