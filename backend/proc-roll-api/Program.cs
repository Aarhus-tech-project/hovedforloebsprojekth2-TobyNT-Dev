using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Proc Roll API",
        Version = "v1",
        Description = "API for managing users in proc-roll project"
    });
});

var app = builder.Build();

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Proc Roll API v1");
        options.RoutePrefix = "swagger"; // optional, default is already "swagger"
    });
}

app.UseHttpsRedirection();

app.UseAuthorization(); // optional for now, but fine to keep

app.MapControllers();

app.Run();