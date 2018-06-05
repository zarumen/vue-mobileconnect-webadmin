import NavBarRoutes from './nav-bar-routes'

const mountRoutes = options => {
  return mount(
    {
      components: {
        NavBarRoutes,
      },
      render(h) {
        return (
          <NavBarRoutes
            routes={[
              {
                name: 'aaa',
                title: 'bbb',
              },
            ]}
          />
        )
      },
    },
    {
      stubs: {
        VBtn: {
          functional: true,
          render(h, { slots }) {
            return <VBtn> {slots().default} </VBtn>
          },
        },
        ...options.stubs,
      },
      ...options,
    }
  )
}

describe('@components/nav-bar-routes', () => {
  it('correctly renders routes with text titles', () => {
    const { element } = mountRoutes({
      propsData: {
        routes: [
          {
            name: 'aaa',
            title: 'bbb',
          },
        ],
      },
    })
    expect(element.textContent).toEqual('bbb')
  })

  it('correctly renders routes with function titles', () => {
    const { element } = mountRoutes({
      propsData: {
        routes: [
          {
            name: 'aaa',
            title: () => 'bbb',
          },
        ],
      },
    })
    expect(element.textContent).toEqual('bbb')
  })
})
