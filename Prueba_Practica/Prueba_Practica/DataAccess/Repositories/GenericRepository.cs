﻿using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Prueba_Practica.DataAccess.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly ApplicationDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(ApplicationDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);
        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
        public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            return await _dbSet.Where(predicate).ToListAsync();
        }
        public async Task AddAsync(T entity){await _dbSet.AddAsync(entity);}
        public void Update(T entity){ _dbSet.Update(entity);}
        public void Remove(T entity) { _dbSet.Remove(entity);}
        public async Task SaveAsync(){await _context.SaveChangesAsync();}
    }
}
