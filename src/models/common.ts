export interface commonProps {
  streetCode: string;
}
export default {
  namespace: 'common',
  state: {
    streetCode: '',
  },
  // 420606001 汉江街道
  // 420606002 王寨街道
  // 420606003 中原街道
  effects: {
    // *testEffect(_, { put, call, select }) {
    //   /* put方法触发一个reducer/effect */
    //   yield put({ type: "update", value: 123 });
    //   /* call方法用于调用接口，能够等待异步接口的返回值 */
    //   yield call(serviceApi, "arg1", "arg2");
    //   /* select方法用于获取store中的值，比如上面的123 */
    //   const value = yield select(store => store.${camelCase(option.name)}.value);
    // },
  },
  reducers: {
    /* 更新状态（通用） */
    update: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
  },
};
