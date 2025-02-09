import {create} from 'zustand';

const useStore = create((set) => ({
  index: 0,
  story: [],
  setStories: (newStories) => {
    console.log("📖 Setting stories:", newStories);
    set({ stories: newStories });
  },
  story2: [],
  setStories2: (newstories2)=>{
    set({stories2: newstories2})
  },
  setIndex: (data) => {
    console.log("Setting index to:", data); 
    set({ index: data });
  },
}));


export default useStore;

