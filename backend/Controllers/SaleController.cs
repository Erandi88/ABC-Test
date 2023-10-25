using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private SalesDbContext _salesDbContext;

        public SaleController(SalesDbContext salesDbContext)
        {
            _salesDbContext = salesDbContext;
        }

        [HttpGet]
        public IEnumerable<Sale> GetAllSale()
        {
            var sales = _salesDbContext.Sales
                .Include(s => s.Customer)
                .Include(s => s.Product)
                .Include(s => s.Store)
                .ToList();
            return sales;
        }

        [HttpGet("{id}")]
        public IActionResult GetSaleById(int id)
        {
            try
            {
                var sale = _salesDbContext.Sales
                    .Include(s => s.Customer)
                    .Include(s => s.Product)
                    .Include(s => s.Store)
                    .FirstOrDefault(s => s.Id == id);

                if (sale == null)
                {
                    return NotFound("Sale not found.");
                }

                return Ok(sale);
            }
            catch (Exception ex)
            {
                return BadRequest("Error retrieving the sale: " + ex.Message);
            }
        }

        [HttpPost]
        public JsonResult CreateSale(Salepost sale)
        {
            Sale sales = new Sale();
            sales.Id = sale.Id;
            sales.StoreId = sale.StoreId;
            sales.CustomerId = sale.CustomerId;
            sales.ProductId = sale.ProductId;
            _salesDbContext.Add(sales);
            _salesDbContext.SaveChanges();
            return new JsonResult(sales);
        }

        [HttpPut]
        public void UpdateSaleById(int id, [FromBody] Salepost sale)
        {
            var existingSale = _salesDbContext.Sales.FirstOrDefault(x => x.Id == id);
           
            if (existingSale == null)
            {
                Console.WriteLine("This id not found");
            }

            existingSale.StoreId = sale.StoreId;
            existingSale.CustomerId = sale.CustomerId;
            existingSale.ProductId = sale.ProductId;

            _salesDbContext.SaveChanges();
        }


        [HttpDelete("{id}")]
        public void DeleteSaleById(int id)
        {
            var deleteSale = _salesDbContext.Sales.FirstOrDefault(x => x.Id == id);
            if (deleteSale != null)
            {
                _salesDbContext.Sales.Remove(deleteSale);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("This id not found");
            }
        }


    }
}
