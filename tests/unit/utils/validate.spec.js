import { validuname, isExternal } from '@/utils/validate.js'

describe('Utils:validate', () => {
  it('validuname', () => {
    expect(validuname('admin')).toBe(true)
    expect(validuname('editor')).toBe(true)
    expect(validuname('xxxx')).toBe(false)
  })
  it('isExternal', () => {
    expect(isExternal('https://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('http://github.com/PanJiaChen/vue-element-admin')).toBe(true)
    expect(isExternal('github.com/PanJiaChen/vue-element-admin')).toBe(false)
    expect(isExternal('/dashboard')).toBe(false)
    expect(isExternal('./dashboard')).toBe(false)
    expect(isExternal('dashboard')).toBe(false)
  })
})
