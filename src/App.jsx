import React, { useState } from 'react';
import { ArrowRight, Box, Layers, Play, Code, Info } from 'lucide-react';

// --- Data & Content ---

const steps = [
  {
    id: 'srcnn',
    title: 'SRCNN (基础入门)',
    subtitle: '超分辨率卷积神经网络 (Super-Resolution CNN)',
    description:
      '这是深度学习在超分领域的开山之作。它将传统的稀疏编码方法对应到了卷积神经网络的三个步骤：特征提取、非线性映射和重建。',
    keyPoints: [
      '输入：经过双三次插值(Bicubic)放大的低清图像',
      '结构：仅由3层卷积层组成，非常简单',
      '无Padding：导致输出图像比输入略小（在早期实现中）'
    ],
    layers: [
      {
        name: 'Input',
        type: 'data',
        shape: '(1, 1, H, W)',
        color: 'bg-gray-200',
        codeRange: [28, 28] // import + class 定义等
      },
      {
        name: 'Conv1 (Feature Extraction)',
        type: 'conv',
        kernel: '9x9',
        filters: 64,
        shape: '(1, 64, H, W)',
        color: 'bg-blue-100',
        text: '特征提取',
        codeRange: [7, 11] // conv1 + relu1
      },
      {
        name: 'ReLU1',
        type: 'act',
        shape: '(1, 64, H, W)',
        color: 'bg-yellow-100',
        codeRange: [12, 12]
      },
      {
        name: 'Conv2 (Non-linear Mapping)',
        type: 'conv',
        kernel: '1x1',
        filters: 32,
        shape: '(1, 32, H, W)',
        color: 'bg-blue-100',
        text: '非线性映射',
        codeRange: [14, 18]
      },
      {
        name: 'ReLU2',
        type: 'act',
        shape: '(1, 32, H, W)',
        color: 'bg-yellow-100',
        codeRange: [19, 19]
      },
      {
        name: 'Conv3 (Reconstruction)',
        type: 'conv',
        kernel: '5x5',
        filters: 1,
        shape: '(1, 1, H, W)',
        color: 'bg-green-100',
        text: '图像重建',
        codeRange: [21, 25]
      },
      {
        name: 'Output',
        type: 'data',
        shape: '(1, 1, H, W)',
        color: 'bg-gray-200',
        codeRange: [32, 32]
      }
    ],
    code: ` 1 import torch
 2 import torch.nn as nn
 3 
 4 class SRCNN(nn.Module):
 5     def __init__(self, num_channels=1):
 6         super(SRCNN, self).__init__()
 7         # 第一层：特征提取
 8         self.conv1 = nn.Conv2d(in_channels=num_channels, 
 9                                out_channels=64, 
10                                kernel_size=9, 
11                                padding=4)
12         self.relu1 = nn.ReLU(inplace=True)
13 
14         # 第二层：非线性映射
15         self.conv2 = nn.Conv2d(in_channels=64, 
16                                out_channels=32, 
17                                kernel_size=1, 
18                                padding=0)
19         self.relu2 = nn.ReLU(inplace=True)
20 
21         # 第三层：重建
22         self.conv3 = nn.Conv2d(in_channels=32, 
23                                out_channels=num_channels, 
24                                kernel_size=5, 
25                                padding=2)
26 
27     def forward(self, x):
28         # x shape: (Batch, 1, H, W)
29         x = self.relu1(self.conv1(x))
30         x = self.relu2(self.conv2(x))
31         x = self.conv3(x)
32         return x
`
  },
  {
    id: 'vdsr',
    title: 'VDSR (深度进阶)',
    subtitle: '极深超分辨率网络 (Very Deep SR)',
    description:
      '为了解决SRCNN层数少、感受野小的问题，VDSR引入了残差学习(Residual Learning)。网络学习的是高频细节（残差），而不是直接预测完整图像。',
    keyPoints: [
      '层数：加深到了20层，极大扩大了感受野',
      '全局残差：Input + Network Output = Final Output',
      '学习目标：网络只需学习图像的"差值"（边缘、纹理），更容易收敛'
    ],
    layers: [
      {
        name: 'Input (Interpolated)',
        type: 'data',
        shape: '(1, 1, H, W)',
        color: 'bg-gray-200',
        residual: 'start',
        codeRange: [24, 24]
      },
      {
        name: 'Conv1 (Input)',
        type: 'conv',
        kernel: '3x3',
        filters: 64,
        shape: '(1, 64, H, W)',
        color: 'bg-blue-100',
        residual: 'pass',
        codeRange: [9, 10]
      },
      {
        name: 'ReLU',
        type: 'act',
        shape: '...',
        color: 'bg-yellow-100',
        residual: 'pass',
        codeRange: [11, 11]
      },
      {
        name: '(Conv+Relu)2...19 (Body)',
        type: 'block',
        kernel: '3x3 x 18 layers',
        filters: 64,
        shape: '(1, 64, H, W)',
        color: 'bg-purple-100',
        text: '18层堆叠',
        residual: 'pass',
        codeRange: [13, 16]
      },
      {
        name: 'Conv20 (Recon)',
        type: 'conv',
        kernel: '3x3',
        filters: 1,
        shape: '(1, 1, H, W)',
        color: 'bg-green-100',
        residual: 'pass',
        codeRange: [18, 20]
      },
      {
        name: 'Global Residual Add',
        type: 'op',
        shape: '(1, 1, H, W)',
        color: 'bg-red-100',
        text: 'Input + Residual',
        residual: 'end',
        codeRange: [29, 29]
      },
      {
        name: 'Output',
        type: 'data',
        shape: '(1, 1, H, W)',
        color: 'bg-gray-200',
        codeRange: [29, 29]
      }
    ],
    code: ` 1 import torch
 2 import torch.nn as nn
 3 
 4 class VDSR(nn.Module):
 5     def __init__(self, num_channels=1, num_layers=20):
 6         super(VDSR, self).__init__()
 7         layers = []
 8 
 9         # 第一层
10         layers.append(nn.Conv2d(num_channels, 64, kernel_size=3, padding=1))
11         layers.append(nn.ReLU(inplace=True))
12 
13         # 中间层 (18层)
14         for _ in range(num_layers - 2):
15             layers.append(nn.Conv2d(64, 64, kernel_size=3, padding=1))
16             layers.append(nn.ReLU(inplace=True))
17 
18         # 最后一层：重建残差图
19         layers.append(nn.Conv2d(64, num_channels, kernel_size=3, padding=1))
20 
21         self.net = nn.Sequential(*layers)
22 
23     def forward(self, x):
24         # x 是插值后的低清图
25         residual = self.net(x)
26 
27         # 全局残差连接 (Global Residual Learning)
28         # 输出 = 输入 + 学习到的残差
29         return x + residual
`
  },
  {
    id: 'video-srcnn',
    title: 'Video-SRCNN (时间维度)',
    subtitle: '引入时间信息的超分',
    description:
      '视频超分的关键在于利用帧间信息。最简单的方法是将连续的多帧（如 t-1, t, t+1）在通道维度拼接（Concatenation），作为网络的输入。',
    keyPoints: [
      '输入变化：(B, C, H, W) -> (B, C*Frames, H, W)',
      'Early Fusion：在第一层就融合了时间信息',
      '结构：骨干网络依然可以是SRCNN或VDSR'
    ],
    layers: [
      {
        name: 'Frames t-1, t, t+1',
        type: 'data',
        shape: '(1, 3, H, W)',
        color: 'bg-orange-100',
        text: '3帧输入',
        codeRange: [17, 17]
      },
      {
        name: 'Conv1 (Temporal Fusion)',
        type: 'conv',
        kernel: '9x9',
        filters: 64,
        shape: '(1, 64, H, W)',
        color: 'bg-blue-100',
        text: '通道融合',
        codeRange: [9, 9]
      },
      {
        name: 'ReLU1',
        type: 'act',
        shape: '(1, 64, H, W)',
        color: 'bg-yellow-100',
        codeRange: [10, 10]
      },
      {
        name: 'Conv2 (Mapping)',
        type: 'conv',
        kernel: '1x1',
        filters: 32,
        shape: '(1, 32, H, W)',
        color: 'bg-blue-100',
        codeRange: [12, 12]
      },
      {
        name: 'ReLU2',
        type: 'act',
        shape: '(1, 32, H, W)',
        color: 'bg-yellow-100',
        codeRange: [13, 13]
      },
      {
        name: 'Conv3 (Recon Center Frame)',
        type: 'conv',
        kernel: '5x5',
        filters: 1,
        shape: '(1, 1, H, W)',
        color: 'bg-green-100',
        text: '预测中间帧',
        codeRange: [15, 15]
      },
      {
        name: 'Output Frame t',
        type: 'data',
        shape: '(1, 1, H, W)',
        color: 'bg-gray-200',
        codeRange: [21, 21]
      }
    ],
    code: ` 1 import torch
 2 import torch.nn as nn
 3 
 4 class VideoSRCNN(nn.Module):
 5     def __init__(self, num_frames=3, num_channels=1):
 6         super(VideoSRCNN, self).__init__()
 7         input_channels = num_channels * num_frames
 8 
 9         self.conv1 = nn.Conv2d(input_channels, 64, kernel_size=9, padding=4)
10         self.relu1 = nn.ReLU(inplace=True)
11 
12         self.conv2 = nn.Conv2d(64, 32, kernel_size=1, padding=0)
13         self.relu2 = nn.ReLU(inplace=True)
14 
15         self.conv3 = nn.Conv2d(32, num_channels, kernel_size=5, padding=2)
16 
17     def forward(self, x):
18         x = self.relu1(self.conv1(x))
19         x = self.relu2(self.conv2(x))
20         x = self.conv3(x)
21         return x
`
  },
  {
    id: 'video-vdsr',
    title: 'Video-VDSR (时空残差)',
    subtitle: '深度残差网络 + 时间信息',
    description: '结合了VDSR的深层结构和Video-SR的多帧输入。通常输入多帧，网络预测中间帧的残差。',
    keyPoints: [
      '输入：多帧拼接',
      '骨干：20层深层网络提取时空特征',
      '残差连接：通常加在中间帧(Center Frame)的输入上'
    ],
    layers: [
      {
        name: 'Input Frames',
        type: 'data',
        shape: '(1, T*C, H, W)',
        color: 'bg-orange-100',
        residual: 'start',
        codeRange: [28, 28]
      },
      {
        name: 'VDSR Backbone',
        type: 'block',
        kernel: '3x3 x 20 layers',
        filters: 64,
        shape: '(1, 64, H, W)',
        color: 'bg-purple-100',
        text: '时空特征提取',
        residual: 'pass',
        codeRange: [13, 20]
      },
      {
        name: 'Conv (Recon)',
        type: 'conv',
        kernel: '3x3',
        filters: 1,
        shape: '(1, 1, H, W)',
        color: 'bg-green-100',
        residual: 'pass',
        codeRange: [22, 23]
      },
      {
        name: 'Add Center Frame',
        type: 'op',
        shape: '(1, 1, H, W)',
        color: 'bg-red-100',
        text: 'Center Frame + Res',
        residual: 'end',
        codeRange: [36, 36]
      },
      {
        name: 'Output Frame',
        type: 'data',
        shape: '(1, 1, H, W)',
        color: 'bg-gray-200',
        codeRange: [36, 36]
      }
    ],
    code: ` 1 import torch
 2 import torch.nn as nn
 3 
 4 class VideoVDSR(nn.Module):
 5     def __init__(self, num_frames=3, num_channels=1):
 6         super(VideoVDSR, self).__init__()
 7         self.num_frames = num_frames
 8         self.num_channels = num_channels
 9 
10         layers = []
11         input_dim = num_frames * num_channels
12 
13         # 第一层：融合时空信息
14         layers.append(nn.Conv2d(input_dim, 64, kernel_size=3, padding=1))
15         layers.append(nn.ReLU(inplace=True))
16 
17         # 中间层：加深网络
18         for _ in range(18):
19             layers.append(nn.Conv2d(64, 64, kernel_size=3, padding=1))
20             layers.append(nn.ReLU(inplace=True))
21 
22         # 最后一层：压缩回图像维度
23         layers.append(nn.Conv2d(64, num_channels, kernel_size=3, padding=1))
24 
25         self.net = nn.Sequential(*layers)
26 
27     def forward(self, x):
28         # x: (B, T*C, H, W)
29         residual = self.net(x)
30 
31         # 提取中间帧
32         center_idx = (self.num_frames // 2) * self.num_channels
33         center_frame = x[:, center_idx:center_idx+self.num_channels, :, :]
34 
35         # 残差相加
36         return center_frame + residual
`
  }
];

// --- Components ---

const DiagramBlock = ({ layer, isLast, onSelectLayer, isActive }) => {
  const isResStart = layer.residual === 'start';
  const isResPass = layer.residual === 'pass';
  const isResEnd = layer.residual === 'end';

  return (
    <div
      className="flex flex-col items-center w-full max-w-md cursor-pointer"
      onClick={onSelectLayer}
    >
      <div className="flex items-center w-full justify-center relative">
        {/* The Main Block */}
        <div
          className={`
          relative flex flex-col items-center justify-center z-10
          p-3 w-36 min-h-[100px] rounded-lg border-2 shadow-sm
          transition-all duration-300
          ${layer.color}
          ${isActive ? 'border-blue-500 ring-2 ring-blue-400 scale-105 shadow-md' : 'border-slate-300 hover:scale-105 hover:border-blue-500 hover:shadow-md'}
        `}
        >
          <span className="text-xs font-bold text-slate-500 uppercase mb-1">
            {layer.type}
          </span>
          <span className="text-sm font-semibold text-center leading-tight">
            {layer.name}
          </span>
          {layer.kernel && (
            <span className="text-xs text-slate-600 mt-1">
              Kernel: {layer.kernel}
            </span>
          )}
          {layer.text && (
            <span className="text-xs italic text-slate-600 mt-1 border-t border-slate-300/50 pt-1">
              {layer.text}
            </span>
          )}

          <div className="absolute -bottom-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded-full font-mono z-20 whitespace-nowrap">
            {layer.shape}
          </div>
        </div>

        {/* Residual Line Visuals (Right Side) */}
        {layer.residual && (
          <div className="absolute right-0 top-0 bottom-0 w-1/2 flex pointer-events-none">
            <div className="w-full h-full border-l border-transparent ml-[calc(50%+4.5rem)] flex flex-col">
              {/* Start of Residual (Branch out) */}
              {isResStart && (
                <div className="h-1/2 w-8 border-t-2 border-r-2 border-slate-400 rounded-tr-xl mt-[50%]" />
              )}

              {/* Passing Through (Vertical Line) */}
              {isResPass && (
                <div className="h-full w-8 border-r-2 border-slate-400" />
              )}

              {/* End of Residual (Merge in) */}
              {isResEnd && (
                <div className="h-1/2 w-8 border-b-2 border-r-2 border-slate-400 rounded-br-xl mb-[50%] relative">
                  <div className="absolute -bottom-2 -left-1">
                    <ArrowRight className="w-4 h-4 text-slate-400 rotate-180" />
                  </div>
                  <span className="absolute right-[-80px] top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 bg-slate-50 px-1">
                    Global Residual
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Connection Arrow to next block */}
      {!isLast && (
        <div className="h-12 w-0.5 bg-slate-300 my-1 relative z-0">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-slate-400">
            <ArrowRight className="w-4 h-4 rotate-90" />
          </div>
        </div>
      )}
    </div>
  );
};

const CodeViewer = ({ code, highlightRange, onSelectLine }) => {
  const lines = code.split('\n');

  return (
    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto shadow-inner border border-slate-700 h-full">
      <pre className="text-xs md:text-sm font-mono leading-relaxed">
        {lines.map((line, i) => {
          const lineNumber = i + 1;
          const isHighlighted =
            highlightRange &&
            lineNumber >= highlightRange[0] &&
            lineNumber <= highlightRange[1];

          return (
            <div
              key={i}
              className={`table-row ${
                isHighlighted ? 'bg-yellow-800/40' : 'hover:bg-slate-800/60'
              } cursor-pointer`}
              onClick={() => onSelectLine && onSelectLine(lineNumber)}
            >
              <span className="table-cell text-slate-500 select-none pr-4 text-right w-8">
                {lineNumber}
              </span>
              <span className="table-cell">
                {line.split('#').map((part, idx) => (
                  <span
                    key={idx}
                    className={
                      idx > 0
                        ? 'text-green-400 italic'
                        : 'text-blue-100 whitespace-pre'
                    }
                  >
                    {idx > 0 ? `#${part}` : part}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
};

const App = () => {
  const [activeStepId, setActiveStepId] = useState('vdsr'); // 默认选 VDSR
  const [highlightRange, setHighlightRange] = useState(null);
  const [activeLayerIndex, setActiveLayerIndex] = useState(null);

  const activeStep = steps.find((s) => s.id === activeStepId);

  const handleLayerSelect = (index) => {
    const layer = activeStep.layers[index];
    setActiveLayerIndex(index);
    setHighlightRange(layer.codeRange || null);
  };

  const handleCodeLineSelect = (lineNumber) => {
    if (!activeStep) return;
    const idx = activeStep.layers.findIndex((layer) => {
      if (!layer.codeRange) return false;
      const [start, end] = layer.codeRange;
      return lineNumber >= start && lineNumber <= end;
    });

    if (idx !== -1) {
      setActiveLayerIndex(idx);
      setHighlightRange(activeStep.layers[idx].codeRange);
    } else {
      setActiveLayerIndex(null);
      setHighlightRange(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded text-white">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-none">
                Super-Res Lab
              </h1>
              <p className="text-xs text-slate-500">Neural Network Tutorial</p>
            </div>
          </div>
          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg overflow-x-auto no-scrollbar">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStepId(step.id);
                  setActiveLayerIndex(null);
                  setHighlightRange(null);
                }}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap
                  ${
                    activeStepId === step.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                  }
                `}
              >
                {step.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            {activeStep.title}
          </h2>
          <p className="text-xl text-slate-500 mt-1">{activeStep.subtitle}</p>

          <div className="mt-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-700 mb-4 leading-relaxed">
              {activeStep.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {activeStep.keyPoints.map((point, i) => (
                <span
                  key={i}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  <Info className="w-3 h-3 mr-2" />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Split View: Diagram & Code */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left: Architecture Visualization */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Box className="w-5 h-5 text-purple-500" />
                  网络结构流 (Network Flow)
                </h3>
                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  Click blocks & code 👈👉
                </span>
              </div>

              <div className="flex flex-col items-center space-y-2 py-4 bg-slate-50/50 rounded-lg border border-slate-100 max-h-[600px] overflow-y-auto custom-scrollbar relative">
                {activeStep.layers.map((layer, index) => (
                  <DiagramBlock
                    key={index}
                    layer={layer}
                    isLast={index === activeStep.layers.length - 1}
                    isActive={index === activeLayerIndex}
                    onSelectLayer={() => handleLayerSelect(index)}
                  />
                ))}
              </div>
              <div className="mt-4 text-xs text-slate-500 text-center">
                注: 灰色连线代表 Global Residual 连接，点击模块可高亮右侧对应代码。
              </div>
            </div>

            {/* Hint Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center">
                <Play className="w-4 h-4 mr-2" />
                核心逻辑
              </h4>
              <p className="text-sm text-amber-900/80">
                {activeStepId === 'srcnn' &&
                  'SRCNN 是特征空间上的非线性映射。Conv1 提取特征，Conv2 变换特征，Conv3 重建。点击左侧卷积层模块，可以看到右侧对应的定义和 forward 调用。'}
                {activeStepId === 'vdsr' &&
                  '仔细观察灰色残差线：Input 既进入 Conv1，也绕过所有层连接到最后的 Add 层。点击 Global Residual Add，可以定位到 forward 中 x + residual 的那几行。'}
                {activeStepId.includes('video') &&
                  'Video 版本的核心是输入维度的变化：我们将时间轴(T)拼到通道轴(C)上，让 2D 卷积一次性处理多帧信息。点击输入/Backbone/Recon，对应右侧初始化和 forward 部分会高亮。'}
              </p>
            </div>
          </div>

          {/* Right: Code Implementation */}
          <div className="lg:col-span-7 h-full flex flex-col">
            <div className="bg-slate-900 rounded-t-xl p-3 border-b border-slate-700 flex justify-between items-center">
              <h3 className="text-slate-200 font-mono text-sm flex items-center gap-2">
                <Code className="w-4 h-4 text-green-400" />
                model.py
              </h3>
              <span className="text-xs text-slate-500">
                点击代码行可反向高亮左侧模块
              </span>
            </div>
            <div className="flex-grow">
              <CodeViewer
                code={activeStep.code}
                highlightRange={highlightRange}
                onSelectLine={handleCodeLineSelect}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
