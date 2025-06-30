using Prueba_Practica.Entities;
using System.Reflection.Metadata;
using QuestPDF.Fluent;
using QuestPDF.Infrastructure;
using QuestPDF;
using System.ComponentModel;

namespace Prueba_Practica.Utils
{
    public static class PdfGenerator
    {
        public static byte[] CrearListadoArticulos(List<Articulo> articulos)
        {
            QuestPDF.Settings.License = LicenseType.Community;
            var document = QuestPDF.Fluent.Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);page.Header()
                    .AlignCenter()     
                    .Text("Listado de Artículos")
                    .FontSize(20)
                    .Bold();
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(40); columns.RelativeColumn();columns.RelativeColumn();
                            columns.RelativeColumn(); columns.RelativeColumn(); columns.RelativeColumn();
                        });
                        table.Header(header =>
                        {
                            header.Cell().Text("ID").Bold(); header.Cell().Text("Código").Bold(); header.Cell().Text("Nombre").Bold();
                            header.Cell().Text("Ubicación").Bold();  header.Cell().Text("Categoría").Bold(); header.Cell().Text("Estado").Bold();
                        });
                        foreach (var art in articulos)
                        {
                            table.Cell().Text(art.Id.ToString()); table.Cell().Text(art.Codigo); table.Cell().Text(art.Nombre);
                            table.Cell().Text(art.Ubicacion); table.Cell().Text(art.Categoria?.Nombre ?? "—");table.Cell().Text(art.Estado?.Nombre ?? "—");
                        }
                    });
                });
            });
            return document.GeneratePdf();
        }
    }
}
