// static interface: a dial, google maps, an info screen and a buttom
// dial in length and click on a point on map
// any time the dial is moved, any time a new point is clicked
  // new synth component is instantiated (after old one is removed)
  // values are plugged into synth and synth plays

import UserInterface from "./interface/index.tsx";


function App () {
    return (
        <div>
            <UserInterface/>
        </div>
    );
}

export default App;