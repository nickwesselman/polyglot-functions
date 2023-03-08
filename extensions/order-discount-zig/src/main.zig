const std = @import("std");
const api = @import("./api.zig");

const Configuration = struct {
    discountPercentage: f64 = 0,
    qualifyingProductTotal: f64= 0
};

pub fn function(input: api.FunctionInput, allocator: std.mem.Allocator) ?api.FunctionResult {
    const noDiscount = api.FunctionResult {
        .discounts = &[0]api.Discount {},
        .discountApplicationStrategy = "MAXIMUM"
    };

    var isVip: bool = false;
    if (input.cart.buyerIdentity) |buyer| if (buyer.customer) |customer|
        if (customer.metafield) |metafield| if (metafield.value) |valueStr| 
            if (std.mem.eql(u8, valueStr, "true")) {
                isVip = true;
            };
    
    if (!isVip) {
        std.debug.print("Not a VIP",.{});
        return noDiscount;
    }

    _ = allocator;
    //if (input.discountNode.metafield) |metafield| if (metafield.value) |config| {
        //std.debug.print("All your {d} are belong to us.\n", .{config.discountPercentage});
    //};
    return api.FunctionResult {
        .discounts = &[0]api.Discount {},
        .discountApplicationStrategy = "FIRST"
    };
}

pub fn main() u8 {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};

    // Read all stdin to an ArrayList
    var inputStr = std.ArrayList(u8).init(gpa.allocator());
    var stdin = std.io.getStdIn().reader();
    var buffer: [1024]u8 = undefined;
    while (true) {
        const bytesRead = stdin.read(&buffer) catch |err| {
            std.debug.print("Error reading function input: {!}",.{err});
            return 1;
        };
        if (bytesRead == 0) {
            break; // No more data
        }
        inputStr.appendSlice(buffer[0..bytesRead]) catch |err| {
            std.debug.print("Error reading function input: {!}",.{err});
            return 1;
        };
    }

    var stream = std.json.TokenStream.init(inputStr.items);
    const input = std.json.parse(api.FunctionInput, &stream, .{
        .allocator = gpa.allocator()
    }) catch |err| {
        std.debug.print("Error parsing function input: {!}",.{err});
        return 1;
    };
    
    const result = function(input, gpa.allocator());

    std.json.stringify(result, .{}, std.io.getStdOut().writer()) catch |err| {
        std.debug.print("Error serializing function output: {!}",.{err});
        return 1;
    };

    return 0;
}