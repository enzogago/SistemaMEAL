using SistemaMEAL.Modulos;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Servicios para los Modulos DAO
builder.Services.AddScoped<EstadoDAO>();
builder.Services.AddScoped<MenuDAO>();

var app = builder.Build();

/////////////////
// Agregamos CORS
app.UseCors(policy =>
    policy.WithOrigins(builder.Configuration["CORS_ORIGIN"]) 
          .AllowAnyMethod()
          .AllowAnyHeader());

app.MapControllers();

// UseDefaultFiles y UseStaticFiles permiten que tu servidor sirva los archivos estáticos generados por React.
app.UseDefaultFiles();
app.UseStaticFiles();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// MapFallbackToFile maneja las rutas desconocidas y las redirige a "/index.html",
// permitiendo que tu aplicación de página única maneje el enrutamiento.
app.MapFallbackToFile("/index.html");

app.Run();
