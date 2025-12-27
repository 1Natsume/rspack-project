import React, { useState, useRef, useEffect } from 'react';
import '@/assets/GalgameCG.css';

interface GalgameCGProps {
  /** 背景图片URL */
  backgroundImage: string;
  /** 表情配置数组 */
  expressions: {
    /** 表情图片URL */
    image: string;
    /** 表情名称/标识 */
    name: string;
    /** 表情在背景上的位置偏移 (百分比或像素) */
    position?: {
      x: number | string;
      y: number | string;
    };
    /** 表情缩放比例 */
    scale?: number;
    /** 表情层级 */
    zIndex?: number;
  }[];
  /** 初始表情索引 */
  initialExpressionIndex?: number;
  /** 点击背景的回调 */
  onBackgroundClick?: () => void;
  /** 切换表情的回调 */
  onExpressionChange?: (expressionName: string, index: number) => void;
  /** 组件宽度 */
  width?: string;
  /** 组件高度 */
  height?: string;
  /** 是否显示表情选择器 */
  showExpressionSelector?: boolean;
  /** 是否允许点击切换表情 */
  clickToSwitch?: boolean;
}

const GalgameCG: React.FC<GalgameCGProps> = ({
  backgroundImage,
  expressions,
  initialExpressionIndex = 0,
  onBackgroundClick,
  onExpressionChange,
  width = '100%',
  height = '600px',
  showExpressionSelector = true,
  clickToSwitch = true
}) => {
  const [currentExpressionIndex, setCurrentExpressionIndex] = useState(initialExpressionIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // 监听容器尺寸变化
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 计算表情位置
  const calculatePosition = (position?: { x: number | string; y: number | string }) => {
    if (!position) return { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' };
    
    const { x, y } = position;
    const left = typeof x === 'string' && x.includes('%') ? x : `${x}px`;
    const top = typeof y === 'string' && y.includes('%') ? y : `${y}px`;
    
    return { left, top };
  };

  // 处理背景点击
  const handleBackgroundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickToSwitch) {
      const nextIndex = (currentExpressionIndex + 1) % expressions.length;
      setCurrentExpressionIndex(nextIndex);
      onExpressionChange?.(expressions[nextIndex].name, nextIndex);
    }
    onBackgroundClick?.();
  };

  // 处理表情选择
  const handleExpressionSelect = (index: number) => {
    setCurrentExpressionIndex(index);
    onExpressionChange?.(expressions[index].name, index);
  };

  // 当前表情配置
  const currentExpression = expressions[currentExpressionIndex];

  return (
    <div className="galgame-cg-container" style={{ width, height }}>
      {/* 背景图层 */}
      <div 
        className="cg-background"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        onClick={handleBackgroundClick}
        ref={containerRef}
        role="button"
        aria-label="点击切换表情"
      >
        {/* 表情图层 */}
        {currentExpression && (
          <div 
            className="cg-expression"
            style={{
              backgroundImage: `url(${currentExpression.image})`,
              ...calculatePosition(currentExpression.position),
              transform: `translate(-50%, -50%) scale(${currentExpression.scale || 1})`,
              zIndex: currentExpression.zIndex || 1
            }}
          />
        )}

        {/* 调试信息（开发时可启用） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-info">
            当前表情: {currentExpression.name} ({currentExpressionIndex + 1}/{expressions.length})
          </div>
        )}
      </div>

      {/* 表情选择器 */}
      {showExpressionSelector && expressions.length > 1 && (
        <div className="expression-selector">
          <div className="selector-title">表情选择</div>
          <div className="expression-thumbnails">
            {expressions.map((expr, index) => (
              <button
                key={expr.name}
                className={`expression-thumbnail ${
                  index === currentExpressionIndex ? 'active' : ''
                }`}
                onClick={() => handleExpressionSelect(index)}
                aria-label={`选择表情: ${expr.name}`}
                title={expr.name}
              >
                <div 
                  className="thumbnail-image"
                  style={{ backgroundImage: `url(${expr.image})` }}
                />
                <span className="thumbnail-name">{expr.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 导航按钮（移动端友好） */}
      {expressions.length > 1 && (
        <div className="expression-navigation">
          <button
            className="nav-button prev"
            onClick={() => {
              const prevIndex = (currentExpressionIndex - 1 + expressions.length) % expressions.length;
              handleExpressionSelect(prevIndex);
            }}
            aria-label="上一个表情"
          >
            ◀
          </button>
          <span className="expression-counter">
            {currentExpressionIndex + 1} / {expressions.length}
          </span>
          <button
            className="nav-button next"
            onClick={() => {
              const nextIndex = (currentExpressionIndex + 1) % expressions.length;
              handleExpressionSelect(nextIndex);
            }}
            aria-label="下一个表情"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default GalgameCG;