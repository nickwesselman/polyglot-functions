const std = @import("std");
const json = std.json;
const api = @import("./api.zig");

pub fn main() !void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    // Read all stdin to an ArrayList
    var inputStr = std.ArrayList(u8).init(gpa.allocator());
    var bufferedReader = std.io.bufferedReader(std.io.getStdIn().reader());
    var buffer: [1024]u8 = undefined;
    while (true) {
        const bytesRead = try bufferedReader.read(&buffer);
        if (bytesRead == 0) {
            break; // No more data
        }
        try inputStr.appendSlice(buffer[0..bytesRead]);
    }

    var stream = std.json.TokenStream.init(inputStr.items);
    const input = try std.json.parse(api.FunctionInput, &stream, .{
        .allocator = gpa.allocator()
    });

    if (input.discountNode.metafield) |metafield| if (metafield.value) |config| {
        std.debug.print("All your {s} are belong to us.\n", .{config});
    };
    

}