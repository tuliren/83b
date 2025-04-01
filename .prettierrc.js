module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  trailingComma: 'es5',
  printWidth: 120,
  singleQuote: true,
  tabWidth: 2,
  importOrder: ['^@/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
