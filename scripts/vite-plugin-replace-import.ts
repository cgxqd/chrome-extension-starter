export default (replacements = {}) => {
  return {
    name: 'vite-plugin-replace-import',
    transform(code: string) {
      Object.entries(replacements).forEach(([oldPath, newPath]) => {
        const regex = new RegExp(`from\\s+['"]${oldPath}['"]`, 'g');
        code = code.replace(regex, `from '${newPath}'`);
      });
      return code;
    },
  };
};
