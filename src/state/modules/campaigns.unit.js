import * as campaignsModule from './campaigns'

describe('@state/modules/campaigns', () => {
  it('exports a valid Vuex module', () => {
    expect(campaignsModule).toBeAVuexModule()
  })
})
