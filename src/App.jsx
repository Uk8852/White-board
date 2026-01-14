import { useEffect, useState } from 'react';
import Tools from './Tools.jsx';

function App() {
  const appID = 1360633089;
  const userID = "utkarsh";
  const roomID = "1254";
  const userName = "Utkarsh Kumar";
  const [currentTool, setCurrentTool] = useState(null);
  const [zegoSuperBoard, setZegoSuperBoard] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const token =
"04AAAAAGlpRVUADL94uV0UNhZKDpOzGwCwYN29cUHHVi/QU80IviZnc0pHj6ityF4SgulTvc5p49C8QgVAW3kIRgynR9T7ttXz/NWYcxbE9bUXu/vwxJj5pHzKEJ2xEwQngtoidR95lEKeidPBjMLkirOyQmS5sNPOMUO/tFykxQmAf80tXEBhdBeDP+1Fso3NeVIN5UaHXEiGTxAaZ3qwoJjToKrBIEwrIyNcW1soBg4FTZ5JPxJM3YRlnakZTExu7uzP4pzwtqIB"
  const server = "wss://webliveroom1360633089-api.coolzcloud.com/ws"

  const initBoard = async () => {
    const { ZegoSuperBoardManager } = await import('zego-superboard-web');
    const { ZegoExpressEngine } = await import('zego-express-engine-webrtc');

    const zg = new ZegoExpressEngine(appID, server);
    const superBoard = ZegoSuperBoardManager.getInstance();

    await superBoard.init(zg, {
      parentDomID: 'parentDomID',
      appID,
      userID,
      token,
    });

      try {
        await zg.loginRoom(
          roomID,
          token,
          { userID: userID, userName: userName },
          { userUpdate: true }
        );
        console.log('loginRoom succeeded');
        setConnectionError(null);
      } catch (err) {
        console.error('loginRoom failed:', err);
        setConnectionError(err || String(err));
        return;
      }

    await superBoard.createWhiteboardView({
      name: 'Virtual Board',
      perPageWidth: 1600,
      perPageHeight: 900,
      pageCount: 1,
    });

    setZegoSuperBoard(superBoard);
    setCurrentTool(superBoard.getToolType());
    try {
      console.log('SuperBoard initialized. keys:', Object.keys(superBoard));
      try {
        console.log('Initial tool type (getToolType):', superBoard.getToolType && superBoard.getToolType());
      } catch (e) {
        console.warn('Error calling getToolType on SuperBoard:', e);
      }
      try { window.__zegoSuperBoard = superBoard; } catch (e) {}
    } catch (e) {
      console.warn('Could not log SuperBoard debug info:', e);
    }
  };

  useEffect(() => {
    initBoard();
  }, []);

  const formatError = (err) => {
    if (!err) return '';
    try {
      if (typeof err === 'string') return err;
      return JSON.stringify(err, Object.getOwnPropertyNames(err), 2);
    } catch (e) {
      try { return String(err); } catch { return 'Unknown error'; }
    }
  };

  const handleToolClick = (tool) => {
    console.log('Tool clicked:', tool);
    if (!zegoSuperBoard) {
      console.warn('SuperBoard not initialized yet!');
      setCurrentTool(tool.type);
      return;
    }

    try {
      const tryCall = (fn, arg) => {
        try {
          const r = fn(arg);
          if (r && typeof r.then === 'function') return r;
          return Promise.resolve(r);
        } catch (err) {
          return Promise.reject(err);
        }
      };

      const candidates = [];
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.setTool) === 'function') candidates.push((t) => zegoSuperBoard.setTool(t));
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.setToolType) === 'function') candidates.push((t) => zegoSuperBoard.setToolType(t));
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.getCurrentView) === 'function') candidates.push((t) => zegoSuperBoard.getCurrentView().setToolType(t));
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.getCurrentBoard) === 'function') candidates.push((t) => zegoSuperBoard.getCurrentBoard().setToolType(t));
      if (typeof zegoSuperBoard.getView === 'function') candidates.push((t) => zegoSuperBoard.getView().setToolType(t));

      if (candidates.length === 0) {
        console.warn('No known setTool method found on SuperBoard. Object keys:', Object.keys(zegoSuperBoard));
        setCurrentTool(tool.type);
        return;
      }

      // Try candidates sequentially until one succeeds
      (async () => {
        for (const fn of candidates) {
          try {
            const res = tryCall(fn, tool.type);
            await res;
            console.log('Tool applied via candidate, type=', tool.type);
            setCurrentTool(tool.type);
            return;
          } catch (err) {
            console.debug('candidate failed:', err);
            // try next
          }
        }
        console.warn('All candidate methods failed to apply tool. SuperBoard object:', zegoSuperBoard);
        setCurrentTool(tool.type);
      })();
    } catch (e) {
      console.error('Error applying tool:', e, 'SuperBoard:', zegoSuperBoard);
      setCurrentTool(tool.type);
    }

    console.log('after click - getToolType:', window.__zegoSuperBoard && window.__zegoSuperBoard.getToolType && window.__zegoSuperBoard.getToolType());
    console.log('after click - viewToolType:', window.__zegoSuperBoard && window.__zegoSuperBoard.getCurrentView && window.__zegoSuperBoard.getCurrentView().getToolType && window.__zegoSuperBoard.getCurrentView().getToolType());
  };

  const setColor = (color) => {
    console.log('Color selected:', color);
    setSelectedColor(color);
    if (!zegoSuperBoard) {
      console.warn('SuperBoard not initialized yet!');
      return;
    }
    // Try to set brush color
    try {
      const tryCall = (fn, arg) => {
        try {
          const r = fn(arg);
          if (r && typeof r.then === 'function') return r;
          return Promise.resolve(r);
        } catch (err) {
          return Promise.reject(err);
        }
      };

      const candidates = [];
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.setBrushColor) === 'function') candidates.push((c) => zegoSuperBoard.setBrushColor(c));
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.getCurrentView) === 'function') candidates.push((c) => zegoSuperBoard.getCurrentView().setBrushColor(c));
      if (typeof (window.__zegoSuperBoard && window.__zegoSuperBoard.getCurrentBoard) === 'function') candidates.push((c) => zegoSuperBoard.getCurrentBoard().setBrushColor(c));
      if (typeof zegoSuperBoard.getView === 'function') candidates.push((c) => zegoSuperBoard.getView().setBrushColor(c));

      if (candidates.length === 0) {
        console.warn('No known setBrushColor method found on SuperBoard. Object keys:', Object.keys(zegoSuperBoard));
        return;
      }

      // Try candidates sequentially until one succeeds
      (async () => {
        for (const fn of candidates) {
          try {
            const res = tryCall(fn, color);
            await res;
            console.log('Color applied via candidate, color=', color);
            return;
          } catch (err) {
            console.debug('candidate failed:', err);
            // try next
          }
        }
        console.warn('All candidate methods failed to apply color. SuperBoard object:', zegoSuperBoard);
      })();
    } catch (e) {
      console.error('Error applying color:', e, 'SuperBoard:', zegoSuperBoard);
    }
  };



  return (
    <div className="h-[100vh] bg-black w-full flex">
      {connectionError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded z-[200] shadow max-w-[90vw]">
          <div className="font-semibold">WebSocket/Room error</div>
          <pre className="text-xs mt-1 whitespace-pre-wrap break-words max-h-40 overflow-auto">{formatError(connectionError)}</pre>
        </div>
      )}
      <Tools currentTool={currentTool} onClick={handleToolClick} isBoardReady={!!zegoSuperBoard} setColor={setColor} selectedColor={selectedColor} />
      <div
        id="parentDomID"
        style={{ flex: 1, height: '100%', backgroundColor: 'white' }}
      />
    </div>
  );
}

export default App;
