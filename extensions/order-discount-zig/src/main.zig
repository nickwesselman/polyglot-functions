const std = @import("std");
const api = @import("./api.zig");

const Configuration = struct {
    discountPercentage: f64 = 0,
    qualifyingProductTotal: f64 = 0
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
        return noDiscount;
    }

    var config: Configuration = .{};
    if (input.discountNode.metafield) |metafield| if (metafield.value) |configStr| {
        var stream = std.json.TokenStream.init(configStr);
        config = std.json.parse(Configuration, &stream, .{
            .allocator = allocator,
            .ignore_unknown_fields = true
        }) catch |err| {
            std.debug.print("Error parsing function config: {!}",.{err});
            return noDiscount;
        };
    };
    if (config.discountPercentage == 0 or config.qualifyingProductTotal == 0) {
        return noDiscount;
    }

    var qualifyingTotal: f64 = 0;
    for (input.cart.lines) |line| {
        if (line.merchandise.product.isQualifying) {
            qualifyingTotal += std.fmt.parseFloat(f64, line.cost.totalAmount.amount) catch 0;
        }
    }
    if (qualifyingTotal < config.qualifyingProductTotal) {
        return noDiscount;
    }

    return api.FunctionResult {
        .discounts = &[1]api.Discount {
            api.Discount {
                .value = api.Value {
                    .percentage = api.Percentage {
                        .value = config.discountPercentage
                    }
                },
                .targets = &[1]api.Target {
                    api.Target {
                        .orderSubtotal = api.OrderSubtotalTarget {
                            .excludedVariantIds = &[0][]const u8 {}
                        }
                    }
                },
                .message = "VIP Discount",
            }
        },
        .discountApplicationStrategy = "FIRST"
    };
}

pub fn main() u8 {
    var arena = std.heap.ArenaAllocator.init(std.heap.page_allocator);
    defer arena.deinit();

    const allocator = arena.allocator();

    // Read all stdin to an ArrayList
    var inputStr = std.ArrayList(u8).init(allocator);
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
        .allocator = allocator
    }) catch |err| {
        std.debug.print("Error parsing function input: {!}",.{err});
        return 1;
    };
    
    const result = function(input, allocator);

    std.json.stringify(result, .{}, std.io.getStdOut().writer()) catch |err| {
        std.debug.print("Error serializing function output: {!}",.{err});
        return 1;
    };

    return 0;
}