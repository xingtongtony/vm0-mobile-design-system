import AppKit
import CoreGraphics

let dir = "/Users/tonyxing/vm0-swiftui-poc"
let names = ["user", "pin", "list", "copy", "plus", "paperclip", "plug", "sparkles", "microphone", "mood-smile"]

func cgImage(_ path: String) -> CGImage? {
    guard let img = NSImage(contentsOfFile: path) else { return nil }
    var rect = NSRect(x: 0, y: 0, width: img.size.width, height: img.size.height)
    return img.cgImage(forProposedRect: &rect, context: nil, hints: nil)
}

let cs = CGColorSpaceCreateDeviceRGB()
let bmInfo = CGImageAlphaInfo.premultipliedLast.rawValue

for name in names {
    let p = "\(dir)/\(name).png"
    guard let cg = cgImage(p) else { print("skip \(name)"); continue }
    let w = cg.width, h = cg.height, bpr = w * 4
    var src = [UInt8](repeating: 0, count: h * bpr)
    guard let sctx = CGContext(data: &src, width: w, height: h, bitsPerComponent: 8,
        bytesPerRow: bpr, space: cs, bitmapInfo: bmInfo) else { continue }
    sctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))

    var out = [UInt8](repeating: 0, count: h * bpr)
    // 亮度→alpha,同时记录线条像素的包围盒(用于按重心居中)
    var minX = w, minY = h, maxX = 0, maxY = 0
    for y in 0..<h {
        for x in 0..<w {
            let idx = y * bpr + x * 4
            let r = Double(src[idx]), g = Double(src[idx + 1]), b = Double(src[idx + 2])
            let lum = (r * 0.299 + g * 0.587 + b * 0.114) / 255.0
            let a = UInt8(max(0, min(255, (1.0 - lum) * 255)))
            out[idx] = 0; out[idx + 1] = 0; out[idx + 2] = 0; out[idx + 3] = a
            if a > 12 { minX = min(minX, x); maxX = max(maxX, x); minY = min(minY, y); maxY = max(maxY, y) }
        }
    }
    guard let octx = CGContext(data: &out, width: w, height: h, bitsPerComponent: 8,
        bytesPerRow: bpr, space: cs, bitmapInfo: bmInfo),
        let full = octx.makeImage() else { continue }

    // 固定窗口(208×208,所有图标同一尺寸→笔画粗细一致)+ 按线条重心居中(→图标居中)
    let win = 208
    var final = full
    if maxX > minX, maxY > minY {
        let cx = (minX + maxX) / 2, cy = (minY + maxY) / 2
        let ox = max(0, min(w - win, cx - win / 2))
        let oy = max(0, min(h - win, cy - win / 2))
        if let cropped = full.cropping(to: CGRect(x: ox, y: oy, width: win, height: win)) {
            final = cropped
        }
    }
    let rep = NSBitmapImageRep(cgImage: final)
    if let png = rep.representation(using: .png, properties: [:]) {
        try? png.write(to: URL(fileURLWithPath: p)); print("done \(name)")
    }
}
