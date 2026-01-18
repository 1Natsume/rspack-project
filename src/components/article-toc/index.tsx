import React, { useState, useEffect, useRef } from 'react';
import './index.css';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ArticleTOCProps {
  contentSelector?: string;  // 文章内容容器的选择器
  headings?: Heading[];      // 手动传入的标题数据
  offset?: number;           // 滚动偏移量（用于固定导航栏）
  maxDepth?: number;         // 最大标题深度
  className?: string;
}

const ArticleTOC: React.FC<ArticleTOCProps> = ({
  contentSelector = '.article-content',
  headings: manualHeadings,
  offset = 80,
  maxDepth = 6,
  className = '',
}) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const tocRef = useRef<HTMLDivElement>(null);

  // 自动从页面提取标题
  useEffect(() => {
    if (manualHeadings) {
      setHeadings(manualHeadings);
      return;
    }

    const extractHeadings = () => {
      const contentElement = document.querySelector(contentSelector);
      const elements = contentElement 
        ? contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6')
        : document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      
      const extracted: Heading[] = [];
      
      elements.forEach((el, index) => {
        const tagName = el.tagName.toLowerCase();
        const level = parseInt(tagName.replace('h', ''), 10);
        
        if (level <= maxDepth) {
          let id = el.id;
          if (!id) {
            id = `heading-${index}-${Date.now()}`;
            el.id = id;
          }
          
          extracted.push({
            id,
            text: el.textContent || '',
            level,
          });
        }
      });
      
      setHeadings(extracted);
    };

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver(extractHeadings);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    extractHeadings();
    
    return () => observer.disconnect();
  }, [contentSelector, manualHeadings, maxDepth]);

  // 监听滚动，高亮当前阅读的标题
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return;

      // 找到当前视口位置最近的标题
      const scrollPosition = window.scrollY + offset;
      let currentActiveId = '';
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const element = document.getElementById(headings[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          currentActiveId = headings[i].id;
          break;
        }
      }
      
      if (currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    // 节流滚动事件
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler);
    handleScroll(); // 初始化
    
    return () => window.removeEventListener('scroll', scrollHandler);
  }, [headings, offset, activeId]);

  // 平滑滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setActiveId(id);
    }
  };

  // 生成缩进样式
  const getIndentStyle = (level: number) => {
    const baseIndent = 12;
    const indent = (level - 1) * baseIndent;
    return { paddingLeft: `${indent}px` };
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`article-toc ${className}`} ref={tocRef}>
      <div className="toc-header">
        <h3>文章目录</h3>
      </div>
      <nav className="toc-nav">
        <ul className="toc-list">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={`toc-item level-${heading.level} ${
                activeId === heading.id ? 'active' : ''
              }`}
              style={getIndentStyle(heading.level)}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className="toc-link"
                aria-current={activeId === heading.id ? 'location' : undefined}
              >
                <span className="toc-text">{heading.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default ArticleTOC;