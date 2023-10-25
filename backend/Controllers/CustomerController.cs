using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private SalesDbContext _salesDbContext;

        public CustomerController(SalesDbContext salesDbContext)
        {
            _salesDbContext = salesDbContext;
        }

        //[HttpGet]
        //public IEnumerable<Customer> GetAllCustomers()
        //{
        //    var customer = _salesDbContext.Customers.ToList();
        //    return customer;
        //}

        [HttpGet]
        public IActionResult GetCustomersByPage(int page, int pageSize)
        {
            List <Customer> customers = new List<Customer>();
            if(page > 0)
            {
                 customers = _salesDbContext.Customers
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();
            }
            else
            {
                customers = _salesDbContext.Customers.ToList();
            }
            

            var totalCustomers = _salesDbContext.Customers.Count(); // Total number of customers

            var totalPages = (int)Math.Ceiling((double)totalCustomers / pageSize);

            var response = new
            {
                Customers = customers,
                TotalPages = totalPages
            };

            return Ok(response);
        }


        

        [HttpGet("{id}")]
        public IActionResult GetCustomerById(int id)
        {
            var customer = _salesDbContext.Customers.FirstOrDefault(x => x.Id == id);
            if (customer == null)
            {
                return NotFound();
            }
            return Ok(customer);
        }

       [HttpPost]
        public JsonResult CreateCustomer(Customer customer)
        {
            _salesDbContext.Add(customer);
            _salesDbContext.SaveChanges();
            return new JsonResult(customer);
        }

        [HttpPut("{id}")]
        public void UpdateCustomerById(int id, [FromBody] Customer customer)
        {
            var updateCustomer = _salesDbContext.Customers.FirstOrDefault(x => x.Id == id);
            if (updateCustomer != null)
            {
                _salesDbContext.Entry<Customer>(updateCustomer).CurrentValues.SetValues(customer);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("This id not found");
            }
        }

        [HttpDelete("{id}")]
        public void DeleteCustomerById(int id)
        {
            var deleteCustomer = _salesDbContext.Customers.FirstOrDefault(x => x.Id == id);
            if (deleteCustomer != null)
            {
                _salesDbContext.Customers.Remove(deleteCustomer);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("This id not found");
            }
        }


    }
}
