import { MyCalendar } from "./components/Calendar";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <MyCalendar />
    </DndProvider>
  );
};
