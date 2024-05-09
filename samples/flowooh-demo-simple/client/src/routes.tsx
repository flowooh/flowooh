const routes: Array<{
  path: string;
  name?: string;
  element?: React.ReactElement;
  page?: string;
}> = [
  {
    path: '/',
    page: '/welcome',
  },
  {
    path: '/definitions/new',
    page: '/definitions/new',
  },
  {
    path: '/definitions',
    name: 'Definitions',
    page: '/definitions/list',
  },
  {
    path: '/executions',
    name: 'Executions',
    page: '/executions/list',
  },
];

export default routes;
