import * as organizationsModule from './organizations'

describe('@state/modules/organizations', () => {
  it('exports a valid Vuex module', () => {
    expect(organizationsModule).toBeAVuexModule()
  })
})
