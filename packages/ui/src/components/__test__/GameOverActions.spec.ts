import { mount } from '@vue/test-utils'
import GameOverActions from '../GameOverActions.vue'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

describe('CustomButton', () => {
  it('renders properly', () => {
    const wrapper = mount(GameOverActions, {
      global: {
        plugins: [
          createTestingPinia({
            initialState: {
              gameOver: false,
              txInfo: null,
            },
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(expect(wrapper.find('#allowing-redeem').exists()).toBe(false))
    expect(expect(wrapper.find('#connect-to-provider').exists()).toBe(false))
    expect(expect(wrapper.find('#transaction-action').exists()).toBe(false))
  })
})
