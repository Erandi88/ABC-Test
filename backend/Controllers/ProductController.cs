using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private SalesDbContext _salesDbContext;

        public ProductController(SalesDbContext salesDbContext)
        {
            _salesDbContext = salesDbContext;
        }

        /*[HttpGet]
        public IEnumerable<Product> GetAllProducts()
        {
            var product = _salesDbContext.Products.ToList();
            return product;
        }*/

        [HttpGet]
        public IActionResult GetProductsByPage(int page, int pageSize)
        {
            List<Product> products = new List<Product>();
            if (page > 0)
            {
                products = _salesDbContext.Products
               .Skip((page - 1) * pageSize)
               .Take(pageSize)
               .ToList();
            }
            else
            {
                products = _salesDbContext.Products.ToList();
            }

            var totalProducts = _salesDbContext.Products.Count(); // Total number of products

            var totalPages = (int)Math.Ceiling((double)totalProducts / pageSize);

            var response = new
            {
                Products = products,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _salesDbContext.Products.FirstOrDefault(x => x.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }

        [HttpPost]
        public JsonResult CreateProduct(Product product)
        {
            _salesDbContext.Add(product);
            _salesDbContext.SaveChanges();
            return new JsonResult(product);
        }

        [HttpPut("{id}")]
        public void UpdateProductById(int id, [FromBody] Product product)
        {
            var updateProduct = _salesDbContext.Products.FirstOrDefault(x => x.Id == id);
            if (updateProduct != null)
            {
                product.Id = id;
                _salesDbContext.Entry<Product>(updateProduct).CurrentValues.SetValues(product);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("The id not found");
            }
        }

        [HttpDelete("{id}")]
        public void DeleteProductById(int id)
        {
            var deleteProduct = _salesDbContext.Products.FirstOrDefault(x => x.Id == id);
            if (deleteProduct != null)
            {
                _salesDbContext.Products.Remove(deleteProduct);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("The id not found");
            }
        }


    }
}
