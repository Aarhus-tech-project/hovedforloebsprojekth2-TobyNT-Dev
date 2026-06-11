// Swagger/OpenAPI types removed to avoid missing assembly reference at compile time
using proc_roll_api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


// Load optional local secrets file (not checked into source control)
builder.Configuration.AddJsonFile("appsettings.Secrets.json", optional: true, reloadOnChange: true);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();
builder.Services.AddAuthentication();
builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendOnly", policy =>
    {
        policy
            .WithOrigins("http://www.gr08.prog.skylab.academy")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
// Configure EF Core DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
                       ?? "Server=(localdb)\\mssqllocaldb;Database=ProcRollDb;Trusted_Connection=True;MultipleActiveResultSets=true";
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

var app = builder.Build();

// Apply any pending migrations at startup (optional for development)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        db.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Failed applying migrations: {ex.Message}");
    }
}

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

//app.UseHttpsRedirection();

//app.UseCors("FrontendOnly");
//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();


app.Run();