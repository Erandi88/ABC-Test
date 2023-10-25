using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OnboardingTask.Models;

namespace OnboardingTask.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreController : ControllerBase
    {
        private SalesDbContext _salesDbContext;

        public StoreController(SalesDbContext salesDbContext)
        {
            _salesDbContext = salesDbContext;
        }

        /*[HttpGet]
        public IEnumerable<Store> GetAllStores()
        {
            var store = _salesDbContext.Stores.ToList();
            return store;
        }*/

        [HttpGet]
        public IActionResult GetStoreByPage(int page, int pageSize)
        {
            List<Store> stores = new List<Store>();
            if (page > 0)
            {
                stores = _salesDbContext.Stores
               .Skip((page - 1) * pageSize)
               .Take(pageSize)
               .ToList();
            }
            else
            {
                stores = _salesDbContext.Stores.ToList();
            }

            var totalStore = _salesDbContext.Stores.Count(); // Total number of store

            var totalPages = (int)Math.Ceiling((double)totalStore / pageSize);

            var response = new
            {
                Stores = stores,
                TotalPages = totalPages
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public IActionResult GetStoreById(int id)
        {
            var store = _salesDbContext.Stores.FirstOrDefault(x => x.Id == id);
            if (store == null)
            {
                return NotFound();
            }
            return Ok(store);
        }

        [HttpPost]
        public JsonResult CreateStore(Store store)
        {
            _salesDbContext.Add(store);
            _salesDbContext.SaveChanges();
            return new JsonResult(store);
        }

        [HttpPut("{id}")]
        public void UpdateStoreById(int id, [FromBody] Store store)
        {
            var updateStore = _salesDbContext.Stores.FirstOrDefault(x => x.Id == id);
            if (updateStore != null)
            {
                store.Id = id;
                _salesDbContext.Entry<Store>(updateStore).CurrentValues.SetValues(store);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("This id not found");
            }
        }

        [HttpDelete("{id}")]
        public void DeleteStoreById(int id)
        {
            var deleteStore = _salesDbContext.Stores.FirstOrDefault(x => x.Id == id);
            if (deleteStore != null)
            {

                _salesDbContext.Stores.Remove(deleteStore);
                _salesDbContext.SaveChanges();
            }
            else
            {
                Console.WriteLine("This id not found");
            }
        }


    }
}
