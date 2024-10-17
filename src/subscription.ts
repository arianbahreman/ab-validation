export default function subscription() {
  const subscribers: CallableFunction[] = [];
  /**
   * Subscribe
   */
  const subscribe = (callback: (result: unknown) => void) => {
    subscribers.push(callback);
    return function unsubscribe() {
      const index = subscribers.indexOf(callback);
      if (index !== -1) {
        subscribers.splice(index, 1);
      }
    };
  };

  const dispatch = (result: unknown) => {
    subscribers.forEach((callback) => callback(result));
  };

  return { subscribe, dispatch };
}
