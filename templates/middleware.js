<%
const _middleware = ((typeof middleware !== 'undefined' && middleware) || []).map(m => ({
  filePath: relativeToBuild(srcDir, dir.middleware, m.src),
  id: m.name || m.src.replace(/\.(js|ts)$/, '').replace(/[\.\\/]/g, '_')
 }))
%><%= _middleware.map(m => `import $${m.id} from '${m.filePath}'`).join('\n') %>

const middleware = {
<%= _middleware.map(m => `  ${m.id}: $${m.id}`).join(',\n') %>
}

export default middleware
